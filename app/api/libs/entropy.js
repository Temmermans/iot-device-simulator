var calculateSum, distinctValuesOfColumn, entropy, entropyOfColumn, log2;

exports.calculateEntropy = function(items, columns, callback) {
    
      var column, entropy, i;
      entropy = {};
      i = 0;
      while (i < columns.length) {
        column = columns[i];
        entropy[column] = entropyOfColumn(items, column);
        i++;
      }
      return callback(entropy);
    
};

entropyOfColumn = function(items, column) {
    
      var count, distinct, key, sumEntropy, total;
      distinct = distinctValuesOfColumn(items, column);
      total = items.length;
      sumEntropy = 0;
      for (key in distinct) {
        count = distinct[key];
        sumEntropy += entropy(count, total);
      }
      return -sumEntropy;
    
};

distinctValuesOfColumn = function(items, column) {
    
      var distinct, i, item, value;
      distinct = {};
      i = 0;
      while (i < items.length) {
        item = items[i];
        value = item[column];
        if (value instanceof Array) {
          value = value.join("|");
        }
        if (typeof distinct[value] !== "undefined") {
          distinct[value] = distinct[value] + 1;
        } else {
          distinct[value] = 1;
        }
        i++;
      }
      return distinct;
    
};

entropy = function(num, total) {
    
      var p;
      p = num / total;
      return p * log2(p);
    
};

log2 = function(n) {
    
    return Math.log(n) / Math.log(2);
    
};

calculateSum = function(items) {
    
      var i, sum;
      sum = 0;
      i = 0;
      while (i < items.length) {
        sum += items[i];
        i++;
      }
      return sum;
    
};