const path = require('path');

module.exports = {
	chainWebpack: (config)=>{
	    config.resolve.alias
	      .set('@', path.join(__dirname,'src'))
	      .set('@C', path.join(__dirname,'src/components'))
		  .set('@M', path.join(__dirname,'src/mixins'))
		  .set('@U', path.join(__dirname,'src/utils'))
  	}
}