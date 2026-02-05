import Seo from "../../components/seo";
import { useSelector } from "react-redux";

const Dashboard = ({}) => {
  const user = useSelector((state) => state.initialState.user);

  return (
    <>
      <Seo pageTitle="Dashboard" />
      <h1 className="">Welcome, {user.name}</h1>
    </>
  );
};

export default Dashboard;
