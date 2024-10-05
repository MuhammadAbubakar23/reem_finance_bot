export interface loginState {
  token: string;
  error: string;
  isLoading: boolean;
}

export interface User{
  username: string;
  password: string;
}
export interface UserInfo {
  user: {
    image: string;
    name: string;
    designation: string;
    ratings: number[];
    averageRating: string;
  };
  notifications: {
    icon: string;
    message: string;
    timestamp: string;
  }[];
  notificationCount: number;
}
