export async function signUp({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  }

  const data = await response.json();
  return data;
}
