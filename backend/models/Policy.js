import mongoose from "mongoose";

const policySchema = new mongoose.Schema({
    policyName: {type: String, required:true, unique:true},
    slug: { type: String, required: true, unique: true, lowercase: true }, //Slug field for URL
    policyDescription: {type: String, required:true},
    companyName: { type: String, required: true }, // LIC, Star Health, etc.
    ageRange: { type: String}, // e.g., "18-60 years old"
    shortDescription: { type: String},
    keyFeatures: {
      policyTerm: { type: String },
      ageCriteria: { type: String },
      coverageDetails: { type: String },
      sumAssuredRange: { type: String },
      taxBenefit: { type: String }
    },
    agentId: {type: mongoose.Schema.Types.ObjectId, ref: "Agent"}
  },{
    timestamps: true
});

//Middleware to generate slug before saving
policySchema.pre("save", function (next) {
  this.slug = this.policyName.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  next();
});

const Policy = mongoose.model('Policy', policySchema);

export default Policy;