export interface NormalizedError {
  message: string;
  code: string;
  status: number;
}

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin.',
  401: 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.',
  403: 'Bạn không có quyền thực hiện thao tác này.',
  404: 'Không tìm thấy dữ liệu yêu cầu.',
  409: 'Dữ liệu đã tồn tại. Vui lòng kiểm tra lại.',
  422: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại các trường thông tin.',
  429: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
  500: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  502: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.',
  503: 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.',
};

const NETWORK_ERROR_MESSAGE =
  'Không thể kết nối. Vui lòng kiểm tra kết nối mạng.';

const DEFAULT_ERROR_MESSAGE = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';

export function getStatusMessage(status: number): string {
  return STATUS_MESSAGES[status] ?? DEFAULT_ERROR_MESSAGE;
}

export function getNetworkErrorMessage(): string {
  return NETWORK_ERROR_MESSAGE;
}

export function getDefaultErrorMessage(): string {
  return DEFAULT_ERROR_MESSAGE;
}
