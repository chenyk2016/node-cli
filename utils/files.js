const fs = require('fs');
const path = require('path');
const output = require('./output')

/**
 * 指定目录下的所有文件
 * @param {*} dir
 */
function getAllFile (dir) {
  let res = fs.readdirSync(dir).map((file) => {
    const pathname = path.join(dir, file)
    const isDirectory = fs.statSync(pathname).isDirectory()
    return {
      type: isDirectory ? 'directory' : 'file',
      name: file,
      path: pathname,
    }
  })
  return res;
}

/**
 * is exists
 *
 * @param  {String} file
 * @return {Promise}
 */
async function isExist(path){
	return new Promise((resolve,reject)=>{
		fs.access(path,  (err) => {
			if(err!==null){
				resolve(false);
			}else{
				resolve(true);
			}
		});
	});
}

/**
 * file or a folder
 *
 * @param  {String} path
 * @return {Promise}
 */
function pathType(path){
	return new Promise((resolve,reject)=>{
		fs.stat(path,(err,stats)=>{
			if(err === null){
				if(stats.isDirectory()){
					resolve("dir");
				}else if(stats.isFile()){
					resolve("file");
				}
			}else{
				reject(error(path));
			}
		});
	});
}

/**
 * copy file
 *
 * @param  {String} from copied file
 * @param  {String} to   target file
 * @param  {Boolean} coverOld  cover exist old file
 */
async function copyFile(from, to, coverOld) {
	if (!coverOld) {
		const exist = await isExist(to);
		if(exist) {
			throw new Error(`文件 ${to} 已经存在`)
		}
	}

	fs.writeFileSync(to, fs.readFileSync(from));
}

/**
 * copy directory
 *
 * @param  {String} from
 * @param  {String} to
 * @param  {Boolean} coverOld  cover exist old file
 */
async function copyDir(from, to, coverOld) {
	const exist = await isExist(to);

	if(!coverOld && exist) {
		output.error(`目录 ${to} 已经存在`)
		return '';
	}

	if (!exist) {
		fs.mkdirSync(to);
	}

	await fs.readdir(from, (err, paths) => {
		paths.forEach((path)=>{
			var src = `${from}/${path}`;
			var dist = `${to}/${path}`;
			fs.stat(src,(err, stat)=> {
				if(stat.isFile()) {
					fs.writeFileSync(dist, fs.readFileSync(src));
				} else if(stat.isDirectory()) {
					copyDir(src, dist, coverOld);
				}
			});
		});
	});
}

function fillPath(pathname) {
  if(/^\//.test(pathname)) {
    return pathname
  } else {
    return path.resolve('', pathname)
  };
}

/**
 *  copy main function
 *
 * @param  {String} from which file or directory you wanna copy
 * @param  {String} to   the target file or dir you copyed
 */
async function copy(from, to, coverOld) {
  from = fillPath(from)
  to = fillPath(to)

	if(!from){
		output.error("pleace input the file or directory you wanna copy");
		return ;
	}
  if(!to){
		output.error("pleace input the target file or directory you wanna copy");
    return;
  }

  const exist = await isExist(from);

  if (!exist) {
		output.error(`想要复制的文件｜目录 ${from} 不存在`);
    return ;
  }
	try{
		output.info(`start copy ${from} `)
		const type = await pathType(from);
		if(type == "file"){
			await copyFile(from, to, coverOld); // file copy
		}else{
			await copyDir(from, to, coverOld); // directory copy
		}
		output.info(`copy to ${to} success`)
	}catch(err){
		output.info(`copy error`)
		console.log(err);
	}
}

module.exports = {
  getAllFile,
  isExist,
  copy,
}