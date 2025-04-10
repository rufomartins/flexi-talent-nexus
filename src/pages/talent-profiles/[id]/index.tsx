
import { useParams } from "react-router-dom";
import TalentProfile from "@/pages/TalentProfile";

export default function TalentProfileDetails() {
  const { id } = useParams();
  
  return <TalentProfile />;
}
