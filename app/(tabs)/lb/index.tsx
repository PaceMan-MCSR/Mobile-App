import { Redirect } from "expo-router";

const index = () => {
  return <Redirect href={`/(tabs)/lb/all`} />;
};

export default index;
