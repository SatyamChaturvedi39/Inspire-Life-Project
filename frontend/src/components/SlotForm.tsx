import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./SlotForm.css";
import BookingConfirmationPopup from "../components/BookingConfirmationPopup";

interface SlotFormProps {
  meetingType: "career" | "policy";
  onClose: () => void;
  notifyTelegram?: boolean; // When true, send Telegram notification for policy meetings if needed.
  ownerId?: string | null | { _id: string; [key: string]: any }; // May be a string or an object with _id.
  policyId?: string; // Optional: if meetingType is "policy", you may pass policyId as well.
}

interface FreeSlotResponse {
  success: boolean;
  data: FreeSlot[];
}

interface FreeSlot {
  time: string;
  status: "Available" | "Booked" | "Unavailable";
}

const SlotForm: React.FC<SlotFormProps> = ({
  meetingType,
  onClose,
  notifyTelegram = false,
  ownerId,
  policyId,
}) => {
  const { id: authId } = useAuth();
  // Use Vite's env API for default admin id.
  const defaultAdminId = import.meta.env.VITE_DEFAULT_ADMIN_ID || "";
  
  // Determine finalOwnerId (ensure it's a string).
  let finalOwnerId: string = "";
  if (ownerId) {
    if (typeof ownerId === "string") {
      finalOwnerId = ownerId;
    } else if (typeof ownerId === "object" && ownerId !== null && "_id" in ownerId) {
      finalOwnerId = ownerId._id;
    }
  } else if (authId) {
    if (typeof authId === "string") {
      finalOwnerId = authId;
    } else if (typeof authId === "object" && authId !== null && "_id" in authId) {
      finalOwnerId = authId._id;
    }
  }
  // For career meetings, if still empty, use defaultAdminId.
  if (meetingType === "career" && !finalOwnerId) {
    finalOwnerId = defaultAdminId;
  }
  console.log("finalOwnerId in SlotForm:", finalOwnerId);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState<string>("");
  const [bookingInfo, setBookingInfo] = useState<{
    name: string;
    date: string;
    time: string;
  } | null>(null);
  const [freeSlotsMap, setFreeSlotsMap] = useState<Record<string, FreeSlot>>({});

  const timeSlots = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
  ];

  const convertToIST = (date: Date) => {
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);
    return istDate.toISOString().split("T")[0];
  };

  const fetchFreeSlots = async (date: Date) => {
    try {
      const formattedDate = convertToIST(date);
      const params: any = {
        date: formattedDate,
        meetingType,
      };
      if (ownerId) params.ownerId = ownerId;
      if (meetingType === "policy" && policyId) params.policyId = policyId;

      const response = await axios.get<FreeSlotResponse>(
        "http://localhost:5001/api/freeslots",
        { params }
      );
      if (response.data.success) {
        const freeSlots: any[] = response.data.data;
        const mapping: Record<string, FreeSlot> = {};
        timeSlots.forEach((time) => {
          const slotData = freeSlots.find((s) => s.time === time);
          mapping[time] = {
            time,
            status: slotData ? slotData.status : "Available",
          };
        });
        setFreeSlotsMap(mapping);
      } else {
        setMessage("Failed to fetch free slots.");
        setMessageColor("red");
      }
    } catch (error) {
      console.error("Error fetching free slots:", error);
      setMessage("Error fetching free slots. Please try again.");
      setMessageColor("red");
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchFreeSlots(selectedDate);
    }
  }, [selectedDate, meetingType, ownerId, policyId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedDate || !selectedTime || !name || !phoneNumber) {
      setMessage("Please fill in all required fields.");
      setMessageColor("red");
      return;
    }
    const formattedDate = convertToIST(selectedDate);
    const formData: any = {
      name,
      phoneNumber,
      email,
      comment,
      date: formattedDate,
      time: selectedTime,
      meetingType,
      ownerId: finalOwnerId,
    };
    if (meetingType === "policy" && policyId) {
      formData.policyId = policyId;
    }

    console.log("Submitting appointment with data:", formData);
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5001/api/appointments", formData);
      setLoading(false);

      if (response.status === 201) {
        setMessage("Slot booked successfully!");
        setMessageColor("green");

        const newBookingInfo = {
          name,
          date: formattedDate,
          time: selectedTime,
        };
        setBookingInfo(newBookingInfo);
        console.log("Booking successful, meetingType:", meetingType, formData);

        setName("");
        setPhoneNumber("");
        setEmail("");
        setComment("");
        setSelectedTime("");

        setTimeout(() => {
          if (selectedDate) fetchFreeSlots(selectedDate);
        }, 500);

        // Telegram Notification Logic:
        // For career meetings, send Telegram for all.
        // For policy meetings, send Telegram if the policy was created by admin (finalOwnerId equals defaultAdminId).
        if (
          meetingType === "career" ||
          (meetingType === "policy" && finalOwnerId === defaultAdminId)
        ) {
          axios
            .post("http://localhost:5001/api/telegram/send-telegram-notification", {
              name,
              phoneNumber,
              email,
              date: formattedDate,
              time: selectedTime,
            })
            .then((res) => {
              console.log("Telegram notification response:", res.data);
            })
            .catch((error) => {
              console.error("Telegram notification error:", error);
            });
        }
      } else {
        setMessage(response.data.message || "Error booking slot.");
        setMessageColor("red");
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Submission error:", error.response?.data || error);
      setMessage(error.response?.data?.message || "Something went wrong. Please try again.");
      setMessageColor("red");
    }
  };

  return ReactDOM.createPortal(
    <div className="slot-popup-overlay">
      <div className="slot-popup-container">
        <div className="slot-popup-header">
          <h2>Book a Slot</h2>
          <button className="slot-popup-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="slot-form">
          {message && (
            <p className="form-message" style={{ color: messageColor, fontWeight: "bold" }}>
              {message}
            </p>
          )}
          <div className="slot-form-fields-container">
            <div className="slot-form__field">
              <label>Name:</label>
              <input
                type="text"
                className="slot-form__input"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="slot-form__field">
              <label>Phone Number:</label>
              <input
                type="text"
                className="slot-form__input"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength={10}
                required
              />
            </div>
            <div className="slot-form__field">
              <label>Email:</label>
              <input
                type="email"
                className="slot-form__input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="slot-form__field">
              <label>Comments:</label>
              <textarea
                className="slot-form__textarea"
                placeholder="Any additional comments?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>
            <div className="slot-form__field">
              <label>Select a Date:</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                minDate={new Date()}
                dateFormat="dd-MM-yyyy"
                className="slot-form__input"
                placeholderText="DD-MM-YYYY"
                required
              />
            </div>
            <div className="slot-form__field">
              <label>Select a Time Slot:</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="slot-form__input"
                required
              >
                <option value="">Select a time slot</option>
                {timeSlots.map((slot, index) => {
                  const slotInfo = freeSlotsMap[slot];
                  const isDisabled = slotInfo && slotInfo.status !== "Available";
                  const labelSuffix = isDisabled ? ` (${slotInfo.status})` : "";
                  return (
                    <option key={index} value={slot} disabled={isDisabled}>
                      {slot + labelSuffix}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="slot-button-div">
              <button type="submit" className="slot-form__button" disabled={loading || !selectedTime}>
                {loading ? "Booking..." : "BOOK SLOT"}
              </button>
            </div>
          </div>
        </form>
        {bookingInfo && (
          <BookingConfirmationPopup onClose={onClose} bookingDetails={bookingInfo} />
        )}
      </div>
    </div>,
    document.body
  );
};

export default SlotForm;
