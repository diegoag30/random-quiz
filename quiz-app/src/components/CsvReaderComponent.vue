<template>
  <div>
    <input type="file" @change="loadQuestions" />
  </div>
</template>

<script>
import Papa from "papaparse";

export default {
  name: "CsvReaderComponent",
  methods: {
    loadQuestions(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const csvContent = reader.result;
          Papa.parse(csvContent, {
            header: false,
            skipEmptyLines: true,
            complete: (results) => {
              const questions = results.data.map((row) => {
                // Filter out blank options
                const options = row
                  .slice(2)
                  .filter((option) => option.trim() !== "");
                return {
                  question: row[0],
                  answer: row[1],
                  options: options,
                };
              });
              this.$emit("questions-loaded", questions);
            },
          });
        };
        reader.readAsText(file);
      }
    },
  },
};
</script>
