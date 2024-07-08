export async function setCookieService(
  key: string,
  value: string,
  maxAge: number
): Promise<void> {
  const response = await fetch("/api/setCookie", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key, value, maxAge }),
  });

  if (!response.ok) {
    throw new Error("Failed to set cookie");
  }

  // Assuming the API responds with a message or some data you might need
  const data = await response.json();
  console.log(data.message);
}
