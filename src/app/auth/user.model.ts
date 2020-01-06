export class User {
  public tokenExpireDate: Date;

  constructor(
    public email: string,
    private expiresInSecs: number,
    private idToken: string,
    public userId: string,
    public refreshToken: string
  ) {
    if (this.idToken) {
      this.tokenExpireDate = new Date((new Date()).getTime() + this.expiresInSecs * 1000);
    }
  }

  get token() {
    if (!this.tokenExpireDate || new Date() < this.tokenExpireDate) {
      return this.idToken;
    } else {
      return null;
    }
  }

  get tokenExpireInMilli() {
    if (!this.tokenExpireDate || new Date() < this.tokenExpireDate) {
      return this.tokenExpireDate.getTime() - new Date().getTime();
    } else {
      return null;
    }
  }
}
