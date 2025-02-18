import Policy from "../models/Policy.js";

export const createPolicy = async (req, res) => {
    try {
        const { policyName, policyDescription, companyName, ageRange, agentId, shortDescription } = req.body;
    
        if (!policyName || !policyDescription || !companyName || !shortDescription) {
          return res.status(400).json({ success: false, message: "All fields are required" });
        }
    
        // Generate slug manually before saving
        const slug = policyName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    
        const newPolicy = new Policy({
          policyName,
          slug, //Now slug is auto-generated
          policyDescription,
          shortDescription,
          companyName,
          ageRange,
          agentId
        });
    
        await newPolicy.save();
    
        res.status(201).json({ success: true, data: newPolicy });
      } catch (error) {
        console.error("Error adding policy:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
      }
};
  
export const getPolicies = async (req, res) => {
    try {
      const policies = await Policy.find().populate("agentId", "name contact");
      res.json({ success: true, data: policies });
    } catch (error) {
      console.error("Error fetching policies:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
  
export const getPolicyBySlug = async (req, res) => {
    try {
      const slug = req.params.slug.toLowerCase().trim(); //Ensure lowercase & trimmed

    console.log("Slug received in backend:", slug); //Debugging step

    const policy = await Policy.findOne({ slug }).populate("agentId", "name contact");

    if (!policy) {
      console.error("Policy Not Found for Slug:", slug); //Debugging log
      return res.status(404).json({ success: false, message: "Policy not found" });
    }

    const policyWithAgent = {
      ...policy.toObject(),
      agentId: policy.agentId || {}, //Avoids `undefined`
    };

    res.json({ success: true, data: policyWithAgent });

    } catch (error) {
      console.error("Error fetching policy:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};