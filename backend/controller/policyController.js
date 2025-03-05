// controllers/policyController.js
import Policy from "../models/Policy.js";

export const createPolicy = async (req, res) => {
  try {
    const {
      policyName,
      policyDescription,
      companyName,
      ageRange,
      shortDescription,
      agentId,
      keyFeatures,
    } = req.body;

    if (!policyName || !policyDescription || !companyName || !shortDescription) {
      console.error("[CreatePolicy] Missing required fields.");
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const existingPolicy = await Policy.findOne({ policyName });
    if (existingPolicy) {
      console.error("[CreatePolicy] Policy already exists with the name of :", policyName);
      return res.status(400).json({ success: false, message: "Policy already exists" });
    }
    
    // Generate a slug from the policy name (ensures it is URL friendly)
    const slug = policyName.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const newPolicy = new Policy({
      policyName,
      slug,
      policyDescription,
      companyName,
      ageRange,
      shortDescription,
      agentId,
      keyFeatures,
    });

    await newPolicy.save();
    console.log("[CreatePolicy] Policy created:", newPolicy);
    res.status(201).json({ success: true, data: newPolicy });
  } catch (error) {
    console.error("[CreatePolicy] Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getPolicies = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const policies = await Policy.find().skip(offset);
    res.json({ success: true, data: policies });
  } catch (error) {
    console.error("[GetPolicies] Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getPolicyBySlug = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase().trim();
    console.log("[GetPolicyBySlug] Fetching policy for slug:", slug);
    const policy = await Policy.findOne({ slug }).populate("agentId", "name contact");
    if (!policy) {
      console.error("[GetPolicyBySlug] Policy not found for slug:", slug);
      return res.status(404).json({ success: false, message: "Policy not found" });
    }
    res.json({ success: true, data: policy });
  } catch (error) {
    console.error("[GetPolicyBySlug] Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const putPolicyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const updateData = req.body;

    // If the policyName is being updated, recalculate the slug based on the new name.
    if (updateData.policyName) {
      updateData.slug = updateData.policyName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }

    const updatedPolicy = await Policy.findOneAndUpdate(
      { slug: slug },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!updatedPolicy) {
      console.error("[PutPolicyBySlug] Policy not found for slug:", slug);
      return res.status(404).json({ message: "Policy not found" });
    }
    console.log("[PutPolicyBySlug] Policy updated:", updatedPolicy);
    res.status(200).json({ message: "Policy updated successfully", data: updatedPolicy });
  } catch (error) {
    console.error("[PutPolicyBySlug] Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const deletePolicyBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const deletedPolicy = await Policy.findOneAndDelete({ slug: slug });
    if (!deletedPolicy) {
      console.error("[DeletePolicyBySlug] Policy not found for slug:", slug);
      return res.status(404).json({ message: "Policy not found" });
    }
    console.log("[DeletePolicyBySlug] Policy deleted:", deletedPolicy);
    res.status(200).json({ message: "Policy deleted successfully", data: deletedPolicy });
  } catch (error) {
    console.error("[DeletePolicyBySlug] Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
