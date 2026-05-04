export interface TAllowOrigins {
  protocol: ("http" | "https")[];
  domain: string;
  ports: number[];
}

const allowOrigins: TAllowOrigins[] = [
  {
    protocol: ["http", "https"],
    domain: "*",
    ports: []
  }
];

export default allowOrigins;
