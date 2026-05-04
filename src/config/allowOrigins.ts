export interface TAllowOrigins {
  protocol: ("http" | "https")[];
  domain: string;
  ports: number[];
}

const allowOrigins: TAllowOrigins[] = [
  {
    protocol: ["http", "https"],
    domain: "127.0.0.1",
    ports: [5173]
  },
  {
    protocol: ["http", "https"],
    domain: "localhost",
    ports: [5173]
  },
  {
    protocol: ["http", "https"],
    domain: "monantrunghoa.netlify.app",
    ports: [80, 443]
  }
];

export default allowOrigins;
