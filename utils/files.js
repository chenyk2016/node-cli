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

function existsSync(path) {
	return fs.existsSync(path);
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

/**
 * 替换文件中的指定字符串
 * @param {string} filepath 文件路径
 * @param {regexp} matchReg 替换的正则
 * @param {string} replaceStr 用于替换的字符串
 */
function replace(filepath, matchReg, replaceStr) {
	fs.readFile(filepath, 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}
		var result = data.replace(matchReg, replaceStr);

		fs.writeFile(filepath, result, 'utf8', function (err) {
			if (err) return console.log(err);
		});
	});
}

/**
 * 替换文件中的指定字符串 - 同步
 * @param {string} filepath 文件路径
 * @param {regexp} matchReg 替换的正则
 * @param {string} replaceStr 用于替换的字符串
 */
function replaceFileSync(filepath, matchReg, replaceStr) {
	const data = fs.readFileSync(filepath, 'utf8');
  var result = data.replace(matchReg, replaceStr);
  fs.writeFileSync(filepath, result, 'utf8');
}


/**
 * 在目录下查找
 * 如果是目录，匹配到了，不会在匹配的目录下继续查找
 *
 *
 * @param {str} targetDir 需要查找的目录
 * @param {*} regexp 匹配文件的正则
 * @param {*} conf.deep 查找的目录层级，0代表当前目录
 * @param {*} conf.deep 查找的目录层级，0代表当前目录
 * @returns
 */
function find(targetDir, regexp, conf) {
	const { deep = 0, ignorePrivate = true } = conf;

  const fileList = getAllFile(targetDir);
  let resArr = [];

  fileList.forEach(file => {
    // 忽略.开头的文件
    if(ignorePrivate && /\..*/.test(file.name)) {
      return;
    }

    if (regexp.test(file.name)) {
      resArr.push(file.path);
    } else if(file.type === 'directory' && deep >= 1) {
      resArr = resArr.concat(find(file.path, regexp, {
				deep: deep - 1,
				ignorePrivate
			}))
    }
  })

  return resArr;
}

function getNameFormPath (path) {
	if (!path) {
		return ''
	}
	let names = path.split('/');
	if (!Array.isArray(names)) {
		names = path.split('\\');
	}
	if (!Array.isArray(names)) {
		return '';
	}
	return names[names.length - 1];
}

module.exports = {
  getAllFile,
  isExist,
	existsSync,
  copy,
	replace,
	find,
	getNameFormPath,
}