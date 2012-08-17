
import os, sys, subprocess, hashlib

def compile(config):
    f = os.path.abspath(os.path.join(config['project_dir'], 'app'))
    if os.path.exists(f):
        print "[INFO] alloy app found at %s" % f
        rd = os.path.abspath(os.path.join(config['project_dir'], 'Resources'))
        # FIXME path resolution
        # FIXME - right now this works on OSX only
        devicefamily = 'none'
        simtype = 'none'
        version = '0'
        deploytype = 'development'

        if config['platform']==u'ios':
            version = config['iphone_version']
            devicefamily = config['devicefamily']
            deploytype = config['deploytype']
        if config['platform']==u'android':
            builder = config['android_builder']
            version = builder.tool_api_level
            deploytype = config['deploy_type']
        if config['platform']==u'mobileweb':
            builder = config['mobileweb_builder']
            deploytype = config['deploytype']
        
        cfg = "platform=%s,version=%s,simtype=%s,devicefamily=%s,deploytype=%s," % (config['platform'],version,simtype,devicefamily,deploytype)
        cmd = ["/usr/local/bin/node","/usr/local/bin/alloy", "compile", f, "--no-colors", "--config", cfg]
        try:
            try: 
                subprocess.check_output(cmd, stderr=subprocess.STDOUT)
            except AttributeError:
                # check_output not available (needs python >= 2.7)
                # This will NOT give the error output from alloy
                # TODO: have an alternative method for returning error output
                #       on python < 2.7.
                subprocess.check_call(cmd)
        except subprocess.CalledProcessError as ex:
            if hasattr(ex, 'output'):
                print ex.output
            print "[ERROR] Alloy compile failed"
            sys.exit(ex.returncode)
