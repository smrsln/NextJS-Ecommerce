import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { FC } from "react";
import { Session } from "next-auth";

interface WithAuthProps {
  session: Session | null;
}

export const withAuth = (WrappedComponent: FC<WithAuthProps>) => {
  const WithAuth: FC<WithAuthProps> = (props) => {
    return <WrappedComponent {...props} />;
  };

  return WithAuth;
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/signup",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
