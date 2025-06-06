import { useParams, useNavigate } from "react-router";

export function test() {
  const params = useParams();
  const navigate = useNavigate();
  return { params, navigate };
}
