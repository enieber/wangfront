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

export function getToken(request: any) {
  const cookies = request.headers.cookie;
  const match = cookies.match(/authToken=([^;]+)/);
  const token = match ? match[1] : null;
  return token
}


export function getUserFromToken(token: string) {
  const [_alg, user, hash] = token.split(".");
  const data = atob(user);
  const data_json = JSON.parse(data)
  return data_json;
}
