import fastify from "fastify";
import * as fs from "fs";

const app = fastify({
    logger: true,
});

app.addContentTypeParser(
    "application/json",
    { parseAs: "string" },
    (req, body, done) => {
        try {
            var json = JSON.parse(body as string);
            done(null, json);
        } catch (err: any) {
            err.statusCode = 400;
            done(err, undefined);
        }
    }
);

interface Seed {
    name: string;
    description: string;
    homepage: string;
    app_name: string;
    app_version: string;
    min_os: string;
    downloads: Downloads;
    uninstall: Uninstall;
}

interface Downloads {
    arm64: string;
    amd64: string;
}

interface Uninstall {
    files: string[];
    directories: string[];
    launchctl: string[];
    other: string[];
}

app.get("/", (req: any, res: any) => {
    res.code(200).send("Hello world!");
});

app.get("/seed", (req: any, res: any) => {
    const id = req.query.id;

    if (!id) {
        res.code(400).send({
            message: "No id specified",
            error: true,
        });
        return;
    }

    const stream = fs.createReadStream(`seeds/${id}.json`);
    res.code(200).type("application/json").send(stream);
});

app.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
    if (err) throw err;
    console.log(`Server listening on ${address}`);
});
