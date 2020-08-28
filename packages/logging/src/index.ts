import winston from "winston";

const logger = (namespace: string) =>
    winston.createLogger({
        level: "debug",
        format: winston.format.combine(
            winston.format((info) => {
                info.level = info.level.toUpperCase().padEnd(5, " ");
                return info;
            })(),
            winston.format.colorize(),
            winston.format.timestamp({
                format: "YYYY-MM-DD HH:mm:ss.SSS Z",
            }),
            winston.format.printf(
                (info) =>
                    `[${info.timestamp}] ${info.level} ${
                        namespace ? `[${namespace}] ` : ""
                    }${info.message}`
            )
        ),
        transports: [new winston.transports.Console(),
    });

export default logger;
