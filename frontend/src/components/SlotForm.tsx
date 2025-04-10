import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./SlotForm.css";
import BookingConfirmationPopup from "../components/BookingConfirmationPopup";
import TermsAndConditionsPopup from "./TermsAndConditions";

// Define a constant array outside the component so it doesn't change.
const TIME_SLOTS: string[] = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
];

interface SlotFormProps {
  meetingType: "career" | "policy";
  onClose: () => void;
  notifyTelegram?: boolean;
  ownerId?: string | null | { _id: string; [key: string]: any };
  policyId?: string;
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
  // Use Vite's env API for default admin id.
  const defaultAdminId = import.meta.env.VITE_DEFAULT_ADMIN_ID || "";
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState<string>("");
  const [bookingInfo, setBookingInfo] = useState<{ name: string; date: string; time: string; } | null>(null);
  const [freeSlotsMap, setFreeSlotsMap] = useState<Record<string, FreeSlot>>({});
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);

  const convertToIST = (date: Date): string => {
    // This converts 5.5 hours to milliseconds:
    // 5.5 hours × 60 mins/hour × 60 secs/min × 1000 ms/sec
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);
    return istDate.toISOString().split("T")[0];
  };

  const fetchFreeSlots = useCallback(async (date: Date) => {
    try {
      const formattedDate = convertToIST(date);
      const params: { date: string; meetingType: string; ownerId?: string; policyId?: string } = {
        date: formattedDate,
        meetingType,
      };
      // Compute ownerId on the spot.
      let resolvedOwnerId = defaultAdminId;
      if (ownerId) {
        if (typeof ownerId === "string") {
          resolvedOwnerId = ownerId;
        } else if (typeof ownerId === "object" && ownerId !== null && "_id" in ownerId) {
          resolvedOwnerId = (ownerId as { _id: string })._id;
        }
      }
      params.ownerId = resolvedOwnerId;
      
      if (meetingType === "policy" && policyId) {
        params.policyId = policyId;
      }

      const response = await axios.get<FreeSlotResponse>(`${import.meta.env.VITE_BACKEND_URL}/api/freeslots`, { params });
      if (response.data.success) {
        const freeSlots: FreeSlot[] = response.data.data;
        const mapping: Record<string, FreeSlot> = {};
        TIME_SLOTS.forEach((time) => {
          const slotData = freeSlots.find((s) => s.time === time);
          mapping[time] = { time, status: slotData ? slotData.status : "Available" };
        });
        setFreeSlotsMap(mapping);
      } else {
        setMessage("Failed to fetch free slots.");
        setMessageColor("red");
      }
    } catch (error: unknown) {
      console.error("Error fetching free slots:", error);
      setMessage("Error fetching free slots. Please try again.");
      setMessageColor("red");
    }
  }, [meetingType, ownerId, policyId, defaultAdminId]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchFreeSlots(selectedDate);
      // Reset the selected time when the date changes.
      setSelectedTime("");
    }
  }, [selectedDate, fetchFreeSlots]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedDate || !selectedTime || !name || !phoneNumber) {
      setMessage("Please fill in all required fields.");
      setMessageColor("red");
      return;
    }
    if (!termsAgreed) {
      setMessage("You must agree to the Terms & Conditions.");
      setMessageColor("red");
      return;
    }
    const formattedDate = convertToIST(selectedDate);

    // Compute resolved ownerId inline rather than relying on state.
    let resolvedOwnerId = defaultAdminId;
    if (ownerId) {
      if (typeof ownerId === "string") {
        resolvedOwnerId = ownerId;
      } else if (typeof ownerId === "object" && ownerId !== null && "_id" in ownerId) {
        resolvedOwnerId = (ownerId as { _id: string })._id;
      }
    }

    const formData = {
      name,
      phoneNumber,
      email,
      comment,
      date: formattedDate,
      time: selectedTime,
      meetingType,
      ownerId: resolvedOwnerId,
      ...(meetingType === "policy" && policyId ? { policyId } : {}),
    };

    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/appointments`, formData);
      setLoading(false);

      if (response.status === 201) {
        setMessage("Slot booked successfully!");
        setMessageColor("green");
        setBookingInfo({ name, date: formattedDate, time: selectedTime });

        setName("");
        setPhoneNumber("");
        setEmail("");
        setComment("");
        setSelectedTime("");

        setTimeout(() => {
          if (selectedDate) fetchFreeSlots(selectedDate);
        }, 500);

        // Telegram Notification Logic:
        // For career meetings, always send notification.
        // For policy meetings, send if resolvedOwnerId equals defaultAdminId or notifyTelegram is true.
        if (
          meetingType === "career" ||
          (meetingType === "policy" &&
            (resolvedOwnerId === defaultAdminId || notifyTelegram))
        ) {
          axios
            .post(`${import.meta.env.VITE_BACKEND_URL}/api/telegram/send-telegram-notification`, {
              meetingType,
              name,
              phoneNumber,
              email,
              comment,
              date: formattedDate,
              time: selectedTime,
            })
            .catch((error) => {
              console.error("Telegram notification error:", error);
            });
        }
      } else {
        setMessage(response.data.message || "Error booking slot.");
        setMessageColor("red");
      }
    } catch (error: unknown) {
      setLoading(false);
      const errMsg =
        (error as any).response?.data?.message ||
        "Something went wrong. Please try again.";
      console.error("Submission error:", errMsg);
      setMessage(errMsg);
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
            <p
              className="form-message"
              style={{ color: messageColor, fontWeight: "bold" }}
            >
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
                inputMode="numeric"
                pattern="\d{10}"
                title="Please enter exactly 10 digits"
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) e.preventDefault();
                }}
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
                maxDate={new Date(
                  new Date().setDate(new Date().getDate() + 30)
                )}
                dateFormat="dd-MM-yyyy"
                className="slot-form__input"
                placeholderText="DD-MM-YYYY"
                required
                customInput={<ReadOnlyInput />}
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
                {TIME_SLOTS.map((slot, index) => {
                  const slotInfo = freeSlotsMap[slot];
                  const isDisabled = slotInfo && slotInfo.status !== "Available";
                  const labelSuffix = isDisabled? ` (${slotInfo.status})`: "";
                  return (
                    <option key={index} value={slot} disabled={isDisabled}>
                      {slot + labelSuffix}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="slot-form__field--checkbox">
              <input
                type="checkbox"
                id="termsCheckbox"
                checked={termsAgreed}
                onChange={() => setTermsAgreed(!termsAgreed)}
                required
              />
              <label htmlFor="termsCheckbox" className="lead-checkbox">
                I agree to the{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTermsPopup(true);
                  }}
                >
                  Terms &amp; Conditions
                </a>.
              </label>
            </div>
            <div className="slot-button-div">
              <button
                type="submit"
                className="slot-form__button"
                disabled={loading || !selectedTime}
              >
                {loading ? "Booking..." : "BOOK SLOT"}
              </button>
            </div>
          </div>
        </form>
        {bookingInfo && (
          <BookingConfirmationPopup
            onClose={onClose}
            bookingDetails={bookingInfo}
          />
        )}
      </div>
      {showTermsPopup && (
        <TermsAndConditionsPopup
          onAccept={() => {
            setTermsAgreed(true);
            setShowTermsPopup(false);
          }}
          onDecline={() => {
            setTermsAgreed(false);
            setShowTermsPopup(false);
          }}
        />
      )}
    </div>,
    document.body
  );
};

// Custom read-only input for DatePicker.
const ReadOnlyInput = React.forwardRef<HTMLInputElement, any>((props, ref) => {
  return <input ref={ref} {...props} readOnly />;
});

export default SlotForm;