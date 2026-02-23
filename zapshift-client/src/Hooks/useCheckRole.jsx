import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useCheckRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: roleData = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.post("/users/role", {
        email: user.email,
      });
      return res.data;
    },
  });

  return {
    role: roleData?.role,
    roleLoading: loading || isLoading,
    refetchRole: refetch,
  };
};

export default useCheckRole;
