import DriverDefault from "../driver/driver.default"
import { migrate } from "../lib/storage/drivers/sql/migration"
import runExample from './build.example.data'
const d = new DriverDefault()


if (process.argv[2] === 'migrate') {
  const argv = process.argv
  argv.splice(0, 3)
  migrate(d.configuration())(...argv)
}

if (process.argv[2] === 'serve') {
  d.registry().handler().serve()
}

if (process.argv[2] === 'seed-example') {
  runExample()
}

