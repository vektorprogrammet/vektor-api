import fs from "node:fs";
import YAML from "yaml";

import { openapiSpecification } from "@/src/openapi/config";

const openapiDocumentPath = "openapi-document.yaml";

try {
	const yamlString = YAML.stringify(openapiSpecification);
	fs.writeFileSync(openapiDocumentPath, yamlString);
	console.info(
		"Wrote to",
		`"${openapiDocumentPath}".`,
		"Remember to add it in the .gitignore.",
	);
} catch {
	console.error("Failed writing to ", openapiDocumentPath);
}
