import { useRouter } from "next/router";
import Navbar from "@/app/components/navbar";

const withNavbar = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    const router = useRouter();
    const hideOnRoutes = ["/signin", "/signup"];

    return (
      <div>
        {!hideOnRoutes.includes(router.pathname) && <Navbar />}
        <Component {...props} />
      </div>
    );
  };
};

export default withNavbar;
