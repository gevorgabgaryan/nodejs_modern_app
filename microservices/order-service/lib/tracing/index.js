import { node } from "@opentelemetry/sdk-node";
import opentelemetry from "@opentelemetry/api";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

const { NodeTracerProvider } = node;
const sdks = [];
const exporter = new OTLPTraceExporter();

const Tracing = (serviceName) => {
  if (sdks[serviceName]) return sdks[serviceName];

  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    }),
  });

  provider.addSpanProcessor(
    new BatchSpanProcessor(exporter, {
      maxQueueSize: 1000,
      scheduledDelayMillis: 30000,
    }),
  );
  provider.register();
  registerInstrumentations({
    instrumentations: getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-fs": {
        enabled: false,
      },
    }),
  });

  return opentelemetry.trace.getTracer(serviceName);
};

export default Tracing;
