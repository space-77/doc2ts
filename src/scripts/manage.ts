import { checkout, getCommitId, getGitVersion } from './utils'

~(async () => {
  // const [err, version, stderr] = await getGitVersion()
  // if (err) throw new Error(stderr)
  // console.log(version)

  // const [err, id, stderr] = await getCommitId()
  // if (err) throw new Error(stderr)
  // console.log(id)

  const [err, res, stderr] = await checkout('test1')
  console.log(err, res, stderr)
})()
