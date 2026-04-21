<template>
  <div>
    <div
      class="drop-zone"
      :class="{ 'drop-zone--over': isDragging, 'drop-zone--loaded': fileName }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      @click="$refs.fileInput.click()"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".csv"
        class="drop-zone__input"
        @change="onFileChange"
      />
      <div class="drop-zone__content">
        <svg v-if="!fileName" class="drop-zone__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke-linecap="round" stroke-linejoin="round"/>
          <polyline points="8 12 12 8 16 12" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="12" y1="8" x2="12" y2="20" stroke-linecap="round"/>
        </svg>
        <svg v-else class="drop-zone__icon drop-zone__icon--ok" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polyline points="20 6 9 17 4 12" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p class="drop-zone__label" v-if="!fileName">
          Drop a CSV file here or <span class="drop-zone__link">browse</span>
        </p>
        <p class="drop-zone__label" v-else>{{ fileName }}</p>
      </div>
    </div>

    <div class="format-section">
      <button class="format-toggle" @click.stop="showFormat = !showFormat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="format-toggle__icon">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        How should the CSV look?
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="format-toggle__chevron" :class="{ 'rotated': showFormat }">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      <div v-if="showFormat" class="format-body" @click.stop>
        <p class="format-desc">One question per row. Columns in order:</p>
        <div class="format-table-wrapper">
          <table class="format-table">
            <thead>
              <tr>
                <th>question</th>
                <th>correct answer</th>
                <th>option 1</th>
                <th>option 2</th>
                <th>option 3…</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in exampleRows" :key="i">
                <td>{{ row.question }}</td>
                <td class="correct-cell">{{ row.answer }}</td>
                <td v-for="(opt, j) in row.options" :key="j">{{ opt }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ul class="format-rules">
          <li>The <strong>correct answer</strong> must exactly match one of the options.</li>
          <li>You can have any number of options per row — blank cells are ignored.</li>
          <li>No header row needed.</li>
        </ul>
        <button class="download-btn" @click="downloadTemplate">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="download-btn__icon">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="7 10 12 15 17 10" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="3" x2="12" y2="15" stroke-linecap="round"/>
          </svg>
          Download template
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Papa from "papaparse";

const TEMPLATE_ROWS = [
  ["What is the capital of France?", "Paris", "Paris", "London", "Berlin", "Madrid"],
  ["Which planet is closest to the Sun?", "Mercury", "Mercury", "Venus", "Earth", "Mars"],
  ["How many sides does a hexagon have?", "6", "4", "5", "6", "8"],
];

export default {
  name: "CsvReaderComponent",
  data() {
    return {
      isDragging: false,
      fileName: null,
      showFormat: false,
      exampleRows: [
        { question: "What is the capital of France?", answer: "Paris", options: ["Paris", "London", "Berlin"] },
        { question: "Closest planet to the Sun?",     answer: "Mercury", options: ["Mercury", "Venus", "Earth"] },
      ],
    };
  },
  methods: {
    onDrop(event) {
      this.isDragging = false;
      const file = event.dataTransfer.files[0];
      if (file) this.parseFile(file);
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) this.parseFile(file);
    },
    parseFile(file) {
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        Papa.parse(reader.result, {
          header: false,
          skipEmptyLines: true,
          complete: (results) => {
            const questions = results.data.map((row) => {
              const options = row.slice(2).filter((o) => o.trim() !== "");
              return { question: row[0], answer: row[1], options };
            });
            this.$emit("questions-loaded", questions);
          },
        });
      };
      reader.readAsText(file);
    },
    downloadTemplate() {
      const csv = Papa.unparse(TEMPLATE_ROWS);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "quiz_template.csv";
      a.click();
      URL.revokeObjectURL(url);
    },
  },
};
</script>

<style>
.drop-zone {
  border: 2px dashed #4a4a4a;
  border-radius: 14px;
  padding: 36px 20px;
  cursor: pointer;
  text-align: center;
  transition: border-color 0.2s ease, background-color 0.2s ease;
  background-color: #252525;
  user-select: none;
}

.drop-zone:hover,
.drop-zone--over {
  border-color: #28a745;
  background-color: #1e2e1e;
}

.drop-zone--loaded {
  border-style: solid;
  border-color: #28a745;
  background-color: #1a2e1a;
}

.drop-zone__input {
  display: none;
}

.drop-zone__icon {
  width: 40px;
  height: 40px;
  color: #777;
  margin: 0 auto 12px;
  display: block;
  transition: color 0.2s ease;
}

.drop-zone:hover .drop-zone__icon,
.drop-zone--over .drop-zone__icon {
  color: #28a745;
}

.drop-zone__icon--ok {
  color: #28a745;
  width: 36px;
  height: 36px;
}

.drop-zone__label {
  font-size: 0.95rem;
  color: #ccc;
  margin: 0;
}

.drop-zone__link {
  color: #28a745;
  text-decoration: underline;
}

/* Format section */
.format-section {
  margin-top: 10px;
  text-align: left;
}

.format-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #888;
  font-size: 0.82rem;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.15s ease;
}

.format-toggle:hover {
  color: #bbb;
}

.format-toggle__icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.format-toggle__chevron {
  width: 14px;
  height: 14px;
  margin-left: auto;
  transition: transform 0.2s ease;
}

.format-toggle__chevron.rotated {
  transform: rotate(180deg);
}

.format-body {
  margin-top: 10px;
  background-color: #222;
  border: 1px solid #333;
  border-radius: 10px;
  padding: 16px;
}

.format-desc {
  font-size: 0.8rem;
  color: #999;
  margin: 0 0 10px;
}

.format-table-wrapper {
  margin-bottom: 12px;
}

.format-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
}

.format-table th {
  background-color: #2a2a2a;
  color: #aaa;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 6px 10px;
  border: 1px solid #333;
}

.format-table td {
  padding: 6px 10px;
  border: 1px solid #2e2e2e;
  color: #ccc;
}

.format-table tbody tr:nth-child(even) td {
  background-color: #252525;
}

.correct-cell {
  color: #28a745 !important;
  font-weight: 600;
}

.format-rules {
  font-size: 0.78rem;
  color: #888;
  padding-left: 16px;
  margin: 0 0 14px;
  line-height: 1.7;
}

.format-rules strong {
  color: #aaa;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  color: #ccc;
  font-size: 0.82rem;
  padding: 6px 12px;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease;
}

.download-btn:hover {
  border-color: #28a745;
  color: #28a745;
  background-color: #1a2e1a;
}

.download-btn__icon {
  width: 14px;
  height: 14px;
}
</style>
