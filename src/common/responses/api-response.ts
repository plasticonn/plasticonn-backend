export const ApiResponse = (
  status: number,
  message: string,
  data: any = null
) => ({
  status,
  message,
  data,
  timestamp: new Date().toISOString(),
});
