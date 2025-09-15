import { NextResponse } from "next/server";

const teamMembers = [
  {
    name: "Mr. Sen Vibol",
    image: "/profile.jpg",
    role: "Lead Backend Developer & System Architect",
    description:
      "Passionate about creating robust, scalable systems to streamline educational administration.",
    social: {
      facebook: "https://www.facebook.com/vibolsen02",
      telegram: "https://t.me/vibolsen",
      github: "https://github.com/VibolSen",
    },
  },
];

export async function GET() {
  return NextResponse.json(teamMembers);
}
