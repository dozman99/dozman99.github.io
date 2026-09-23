export interface Certification {
  name: string
  issuer: string
  url: string
}

export const certifications: Certification[] = [
  {
    name: "DevOps Engineer Expert",
    issuer: "Microsoft Azure",
    url: "https://learn.microsoft.com/en-us/users/snowpuppy/credentials/20e994cb11398236",
  },
  {
    name: "Azure Administrator",
    issuer: "Microsoft Azure",
    url: "https://learn.microsoft.com/en-us/users/snowpuppy/credentials/9565cc0a4322528d",
  },
  {
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    url: "https://www.credly.com/badges/78d17738-f6fa-48ab-b02a-8395b5309469",
  },
  {
    name: "Certified Incident Responder",
    issuer: "PagerDuty",
    url: "https://www.credly.com/badges/3bde2f69-b9b8-48c1-aa1d-aafd7a9019f5",
  },
  {
    name: "Azure Fundamentals",
    issuer: "Microsoft Azure",
    url: "https://www.credly.com/badges/0f187469-b424-41f8-ba90-721e76f95cf9",
  },
]
