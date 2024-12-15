import { withAuth, getServerSideProps } from "@/hoc/withAuth";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";

interface HomeProps {
  session: Session | null;
}

const Home: React.FC<HomeProps> = ({ session }) => {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/signin" });
    window.location.href = "/signin";
  };

  return (
    <div>
      <div>
        <h2>User Information</h2>
        <p>Name: {session?.user?.name}</p>
        <p>Email: {session?.user?.email}</p>
        <img
          src={session?.user?.image || ""}
          alt="Profile"
          style={{ width: 96, height: 96 }}
        />
      </div>

      <div>
        <h2>Session Details</h2>
        <p>
          Expires:{" "}
          {session?.expires
            ? new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              }).format(new Date(session.expires))
            : ""}
        </p>
        <p>{JSON.stringify(session, null, 2)}</p>
      </div>

      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export { getServerSideProps };
export default withAuth(Home);
