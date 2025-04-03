import SparkMD5 from "spark-md5"

export const computeFileMD5 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    const spark = new SparkMD5.ArrayBuffer()

    reader.onload = (e) => {
      spark.append(e.target?.result as ArrayBuffer)
      resolve(spark.end())
    }

    reader.onerror = (e) => {
      reject(e)
    }

    reader.readAsArrayBuffer(file)
  })
}
