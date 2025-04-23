const Docker = require('dockerode');
const mqtt = require('mqtt');
const util = require('util'); 
const docker = new Docker();
const express = require('express');
const app = express();
const tar = require('tar-fs');
const path = require('path');
const fs = require('fs');
const {execSync} = require('child_process')
app.use(express.json());

async function startContainerByName(name) {
  try {
    const container = docker.getContainer(name);
    const info = await container.inspect();

    if (info.State.Running) {
      console.log(`Container '${name}' is already running.`);
      return;
    }

    await container.start();
    console.log(`Container '${name}' started.`);
  } catch (err) {
    console.error(`Failed to start container '${name}':`, err.message);
  }
}

async function stopContainerByName(name) {
  try {
    const container = docker.getContainer(name);
    const info = await container.inspect();

    if (!info.State.Running) {
      console.log(`Container '${name}' is already stopped.`);
      return;
    }

    await container.stop();
    console.log(`Container '${name}' stopped.`);
  } catch (err) {
    console.error(`Failed to stop container '${name}':`, err.message);
  }
}

async function buildContainerImage(name) {
  const contextPath = path.resolve(__dirname, 'containers', name);
  const dockerfilePath = path.join(contextPath, 'Dockerfile');

  if (!fs.existsSync(dockerfilePath)) {
    console.error('❌ Dockerfile not found at:', dockerfilePath);
    return;
  }

  const tarStream = tar.pack(contextPath, {
    ignore: () => false
  });

  const tag = process.env.TAG || 'next';
  let imageTag = `ghcr.io/aaron97neu/neural-net-visualizer:${tag}`;
  switch (name){
    case 'ai-paddle-control':
      imageTag = `ghcr.io/aaron97neu/ai-paddle-control:${tag}`;
      break;
    case 'audio-engine':
      imageTag = `ghcr.io/aaron97neu/audio-engine:${tag}`;
      break;
    case 'clocktower-visualizer':
      imageTag = `ghcr.io/aaron97neu/clocktower-visualizer:${tag}`;
      break;
    case 'game-engine':
      imageTag = `ghcr.io/aaron97neu/game-engine:${tag}`;
      break;
    case 'gameboard':
      imageTag = `ghcr.io/aaron97neu/gameboard:${tag}`;
      break;
    case 'human-paddle-control':
      imageTag = `ghcr.io/aaron97neu/human-paddle-control:${tag}`;
      break;
    case 'human-visualizer':
      imageTag = `ghcr.io/aaron97neu/human-visualizer:${tag}`;
      break;
    case 'log-server':
      imageTag = `log-server:latest`;
      break;
    case 'neural-net-visualizer':
      imageTag = `ghcr.io/aaron97neu/neural-net-visualizer:${tag}`;
      break;
  }

  docker.buildImage(tarStream, {
    context: __dirname,
    t: imageTag,
    dockerfile: 'Dockerfile', // Optional, but can be explicit
    nocache: true,
    buildargs: {
      CERTS: 'zscaler'
    },
  },(err, stream) => {
    if (err) {
      console.error('❌ Error during build:', err);
      return;
    }

    // Track progress
    docker.modem.followProgress(stream, onFinished, onProgress);

    function onProgress(event) {
      if (event.stream) process.stdout.write(event.stream);
    }

    function onFinished(err, output) {
      if (err) {
        console.error('❌ Build failed:', err);
        return;
      }
      console.log(`✅ Successfully built image: ${imageTag}`);
    }
  });
}

async function removeSpecificContainer(containerName) {
  try {
    const container = docker.getContainer(containerName);

    // Inspect to check if it's running
    const info = await container.inspect();
    if (info.State.Running) {
      console.log(`🛑 Stopping container: ${containerName}`);
      await container.stop();
    }

    console.log(`🗑 Removing container: ${containerName}`);
    await container.remove({ force: true });

    console.log(`✅ Successfully removed container: ${containerName}`);
  } catch (err) {
    console.error(`❌ Error removing container "${containerName}":`, err.message);
  }
}

async function composeUpSingle(serviceName) {
  try {
    console.log(`🔍 Fetching configuration for service: ${serviceName}...`);

    // Get parsed docker-compose configuration in JSON format
    const output = execSync('docker compose config --format json', { encoding: 'utf-8' });
    const config = JSON.parse(output);

    if (!config.services || !config.services[serviceName]) {
      console.error(`❌ Service "${serviceName}" not found in docker-compose.yml`);
      return;
    }

    const service = config.services[serviceName];
    console.log(`🚀 Processing service: ${serviceName}`);

    const imageName = service.image || `${serviceName}-custom`;

    // Build image if necessary
    if (service.build) {
      console.log(`🔨 Building image for ${serviceName} from ${service.build.context}...`);
      await new Promise((resolve, reject) => {
        docker.buildImage({ context: service.build.context }, { t: imageName }, (err, stream) => {
          if (err) return reject(err);
          docker.modem.followProgress(stream, (err) => (err ? reject(err) : resolve()));
        });
      });
      console.log(`✅ Successfully built ${imageName}`);
    } else {
      // Pull image if needed
      console.log(`🔄 Pulling image ${imageName}...`);
      await docker.pull(imageName, (err, stream) => {
        if (err) throw err;
        docker.modem.followProgress(stream, () => console.log(`✅ Pulled ${imageName}`));
      });
    }

    // Setup container options
    const portBindings = {};
    const exposedPorts = {};
    if (service.ports) {
      service.ports.forEach(portStr => {
        const [host, container] = portStr.split(':');
        exposedPorts[`${container}/tcp`] = {};
        portBindings[`${container}/tcp`] = [{ HostPort: host }];
      });
    }

    console.log(`📦 Creating container ${serviceName}...`);
    const container = await docker.createContainer({
      name: serviceName,
      Image: imageName,
      ExposedPorts: exposedPorts,
      HostConfig: {
        PortBindings: portBindings,
      },
      Env: service.environment || [],
    });

    await container.start();
    console.log(`🚀 Started container "${serviceName}"`);

  } catch (err) {
    console.error('❌ Error in composeUpSingle:', err.message);
  }
}

app.post('/start-container/:name', async (req, res) => {
  const name = req.params.name;

  if (!name) {
    return res.status(400).json({ error: 'Container name is required' });
  }

  try {
    await startContainerByName(name);
    res.json({ success: true, message: `Container ${name} started.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/stop-container/:name', async (req, res) => {
  const name = req.params.name;

  if (!name) {
    return res.status(400).json({ error: 'Container name is required' });
  }

  try {
    await stopContainerByName(name);
    res.json({ success: true, message: `Container ${name} stopped.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/build-container/:name', async (req, res) => {
  const name = req.params.name;

  if (!name) {
    return res.status(400).json({ error: 'Container name is required' });
  }

  try {
    await buildContainerImage(name);
    res.json({ success: true, message: `Container ${name} built.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/down-container/:name', async (req, res) => {
  const name = req.params.name;

  if (!name) {
    return res.status(400).json({ error: 'Container name is required' });
  }

  try {
    await removeSpecificContainer(name);
    res.json({ success: true, message: `Container ${name} stopped.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/up-container/:name', async (req, res) => {
  const name = req.params.name;

  if (!name) {
    return res.status(400).json({ error: 'Container name is required' });
  }

  try {
    await composeUpSingle(name);
    res.json({ success: true, message: `Container ${name} added.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(5006, () => {
  console.log('API listening on port 5006');
});
//const originalLog = console.log;

const mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL, {
  clientId: 'docker-log-publisher'
});

// console.log = function(...args) {
//   const message = util.format(...args);
//   mqttClient.publish('app/logs/log-server', message);
//   originalLog.apply(console, args);
// };

// Track active log streams
const activeContainers = new Map();

// Connect to MQTT
mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  startMonitoring();
});

mqttClient.on('error', (err) => {
    console.error('MQTT connection error:', err);
  });
  

// Monitor Docker containers
async function startMonitoring() {
  // Get all running containers
  const containers = await docker.listContainers();
  
  // Start tracking each container
  for (const containerInfo of containers) {
    await trackContainerLogs(containerInfo);
  }

  // Watch for new containers
  const dockerEvents = await docker.getEvents();
  dockerEvents.on('data', (chunk) => {
    const event = JSON.parse(chunk.toString());
    if (event.Type === 'container' && event.Action === 'start') {
      docker.getContainer(event.id).inspect()
        .then(containerInfo => trackContainerLogs(containerInfo));
    }
  });
}

// Track logs for a single container
async function trackContainerLogs(containerInfo) {
  let containerName = "";
  if(!containerInfo.Names && containerInfo.Name){
    containerName = containerInfo.Name.replace(/^\//, '');
  }else{
    containerName = containerInfo.Names[0].replace(/^\//, '');
  }
  const container = docker.getContainer(containerName);

  // Skip if already tracking
  if (activeContainers.has(containerName)) return;

  console.log('Tracking curr container: ' + containerName);

  // Start log stream
  const logStream = await container.logs({
    follow: true,
    stdout: true,
    stderr: true,
    tail: 0,
  });

  // Process log chunks
  logStream.on('data', (chunk) => {
    parseDockerLog(chunk).forEach(message => {
      const payload = message.content;

      mqttClient.publish(
        `docker/logs/${containerName}`,
        payload,
        { qos: 1 }
      );
    });
  });

  // Handle stream end
  logStream.on('end', () => {
    activeContainers.delete(containerName);
  });

  // Store reference
  activeContainers.set(containerName, logStream);
}

// Parse Docker's log format (header + message)
function parseDockerLog(chunk) {
  const messages = [];
  for (let i = 0; i < chunk.length; ) {
    const header = chunk.slice(i, i + 8);
    const type = header.readUInt8(0);
    const timestamp = new Date(header.readUInt32BE(4) * 1000).toISOString();
    const length = header.readUInt32BE(4);

    messages.push({
      type: type === 1 ? 'stdout' : 'stderr',
      timestamp: timestamp,
      content: chunk.slice(i + 8, i + 8 + length).toString('utf8')
    });

    i += 8 + length;
  }
  return messages;
}

// Cleanup on exit
process.on('SIGINT', () => {
  activeContainers.forEach((stream, name) => {
    stream.destroy();
    console.log(`Stopped tracking ${name}`);
  });
  mqttClient.end();
  process.exit();
});