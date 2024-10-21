export function builderHeader(context: any) {
  const { req } = context;
  const cookies = req.headers.cookie || "";
  const match = cookies.match(/authToken=([^;]+)/);
  const token = match ? match[1] : null;
  let headers = {};
  if (token) {
    headers = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return headers;
}

export function getToken(request) {
  const cookies = request.headers.cookie;
  const match = cookies.match(/authToken=([^;]+)/);
  const token = match ? match[1] : null;
  return token
}
