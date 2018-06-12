
var utils = {

  mergeObj: (o1, o2) => {
    if (o1 == null || o2 == null) {
      return o1
    }

    for (var key in o2) {
      if (o2.hasOwnProperty(key)) {
        o1[key] = o2[key]
      }
    }

    return o1
  },

  sum: (array) => {
    return array.reduce((a, b) => { return a + b })
  }

}

export default utils
