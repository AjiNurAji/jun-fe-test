import React from "react";

const useFirebaseAuth = () => {
  const [authUser, setAuthUser] = React.useState(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const authStateChange = async (authState) => {

  }
}

export default useFirebaseAuth;