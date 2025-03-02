// controllers/policyController.js
import Policy from "../models/Policy.js";

// Create a new policy (Agent and Admin can use this)
export const createPolicy = async (req, res) => {
  try {
    const { policyName, policyDescription, companyName, ageRange, shortDescription, agentId, keyFeatures } = req.body;
    
    // Validate required fields
    if (!policyName || !policyDescription || !companyName || !shortDescription) {
      console.error("Missing required fields in createPolicy");
      return res.status(400).json({ success: false, message: "Policy Name, Policy Description, Company Name, and Short Description are required" });
    }

    const existingPolicy = await Policy.findOne({ policyName });
    if (existingPolicy) {
      console.error("[CreatePolicy] Policy already exists with the name of :", policyName);
      return res.status(400).json({ success: false, message: "Policy already exists" });
    }
    
    // Generate a slug from the policy name (ensures it is URL friendly)
    const slug = policyName.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    
    // Create a new Policy document with keyFeatures
    const newPolicy = new Policy({
      policyName,
      slug,
      policyDescription,
      shortDescription,
      companyName,
      ageRange,
      agentId,     // optional: if provided, reference the agent who created this policy
      keyFeatures, // contains additional fields such as policyTerm, coverageDetails, etc.
    });
    
    await newPolicy.save();
    console.log("Policy created successfully:", newPolicy);
    res.status(201).json({ success: true, data: newPolicy });
  } catch (error) {
    console.error("Error adding policy:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get a list of policies with pagination support
export const getPolicies = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 16; // Default to 16 policies
    const offset = parseInt(req.query.offset) || 0;  // Default to start from the beginning

    const policies = await Policy.find().skip(offset).limit(limit);
    res.json({ success: true, data: policies });
  } catch (error) {
    console.error("Error fetching policies:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get a single policy by slug
export const getPolicyBySlug = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase().trim();
    console.log("Fetching policy for slug:", slug);
    
    // Optionally, populate agentId if needed (if agent data is available)
    const policy = await Policy.findOne({ slug }).populate("agentId", "name contact");
    if (!policy) {
      console.error("Policy not found for slug:", slug);
      return res.status(404).json({ success: false, message: "Policy not found" });
    }

    // If agentId is not set, ensure it's at least an empty object
    const policyWithAgent = {
      ...policy.toObject(),
      agentId: policy.agentId || {},
    };

    console.log("Policy found:", policyWithAgent);
    res.json({ success: true, data: policyWithAgent });
  } catch (error) {
    console.error("Error fetching policy:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update a policy by slug
export const putPolicyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const updateData = req.body;
    
    const updatedPolicy = await Policy.findOneAndUpdate(
      { slug: slug },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedPolicy) {
      console.error("Policy not found for update with slug:", slug);
      return res.status(404).json({ message: "Policy not found" });
    }
    
    console.log("Policy updated successfully:", updatedPolicy);
    res.status(200).json({ message: "Policy updated successfully", data: updatedPolicy });
  } catch (error) {
    console.error("Error updating policy:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a policy by slug
export const deletePolicyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const deletedPolicy = await Policy.findOneAndDelete({ slug: slug });
    if (!deletedPolicy) {
      console.error("Policy not found for deletion with slug:", slug);
      return res.status(404).json({ message: "Policy not found" });
    }
    
    console.log("Policy deleted successfully:", deletedPolicy);
    res.status(200).json({ message: "Policy deleted successfully", data: deletedPolicy });
  } catch (error) {
    console.error("Error deleting policy:", error);
    res.status(500).json({ message: "Server error" });
  }
};