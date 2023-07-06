/* Chops arriving chunks along new lines,
    takes into account that a chunk might end middle of line */
const splitStream = () => {
  const splitOn = '\n';
  let buffer = '';
  return new TransformStream({
    transform(chunk, controller) {
      buffer += chunk;
      const parts = buffer.split(splitOn);
      parts.slice(0, -1).forEach((part) => controller.enqueue(part));
      buffer = parts[parts.length - 1];
    },
    flush(controller) {
      if (buffer) controller.enqueue(buffer);
    }
  });
};

/* Parses JSON if row looks like JSON (with eventual comma at end of line) */
const parseJSON = () => {
  return new TransformStream({
    transform(chunk, controller) {
      // IGONRES THE [ and ]
      if (chunk.endsWith(',')) {
        controller.enqueue(JSON.parse(chunk.slice(0, -1)));
      } else if (chunk.endsWith('}')) {
        controller.enqueue(JSON.parse(part));
      }
    }
  });
};

const jsonToTableRow = (insertPoint, startTime) => {
  let firstPaint = true;
  return new WritableStream({
    write(json) {
      addRow(json, insertPoint);
      if (firstPaint) {
        const firstTime = new Date();
        console.log(`First chunk - ${firstTime}`);
        document.getElementById('firstpaint').innerText =
          (firstTime - startTime) / 1000;
        firstPaint = false;
      }
    },
    abort(err) {
      console.error(err);
    }
  });
};

const fetchAllData = (many) => {
  const startTime = new Date();
  console.log(`Start Fetch ${many} - ${startTime}`);
  const insertPoint = document.getElementById('body');
  const url = `/data/${many}`;
  fetch(url)
    .then((resp) => resp.json())
    .then((json) => {
      for (let row in json) {
        addRow(json[row], insertPoint);
      }
    })
    .then(() => {
      const endTime = new Date();
      console.log(`End Fetch ${many} - ${endTime}`);
      document.getElementById('duration').innerText =
        (endTime - startTime) / 1000;
      document.getElementById('firstpaint').innerText =
        (endTime - startTime) / 1000;
    })
    .catch((e) => console.error(e));
};

const addRow = (data, insertPoint) => {
  const row = document.createElement('tr');
  const col1 = document.createElement('td');
  col1.innerText = data.count;
  const col2 = document.createElement('td');
  col2.innerText = data.data;
  row.appendChild(col1);
  row.appendChild(col2);
  insertPoint.appendChild(row);
};

const chunkAllData = async (many) => {
  console.log(`Chunk ${many}`);
  const url = `/data/${many}`;
  const startTime = new Date();
  console.log(`Start Chunk - ${startTime}`);
  const insertPoint = document.getElementById('body');
  const httpResponse = await fetch(url);
  await httpResponse.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(splitStream())
    .pipeThrough(parseJSON())
    .pipeTo(jsonToTableRow(insertPoint, startTime));

  const endTime = new Date();
  console.log(`End Chunk- ${endTime}`);
  document.getElementById('duration').innerText = (endTime - startTime) / 1000;
};

const getRowsRequested = () => {
  const rows = document.getElementById('howmany');
  return Number(rows.value);
};

const bootstrap = () => {
  const fetchme = document.getElementById('fetchme');
  fetchme.addEventListener('click', (event) => {
    event.preventDefault();
    fetchAllData(getRowsRequested());
  });
  const chunkme = document.getElementById('chunkme');
  chunkme.addEventListener('click', (event) => {
    event.preventDefault();
    chunkAllData(getRowsRequested());
  });
};

if (document.readyState != 'loading') {
  bootstrap();
} else {
  document.addEventListener('DOMContentLoaded', bootstrap);
}
