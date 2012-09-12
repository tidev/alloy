
import os, sys, subprocess, hashlib

import subprocess

def check_output(*popenargs, **kwargs):
    r"""Run command with arguments and return its output as a byte string.

    Backported from Python 2.7 as it's implemented as pure python on stdlib.

    >>> check_output(['/usr/bin/python', '--version'])
    Python 2.6.2
    """
    process = subprocess.Popen(stdout=subprocess.PIPE, *popenargs, **kwargs)
    output, unused_err = process.communicate()
    retcode = process.poll()
    if retcode:
        cmd = kwargs.get("args")
        if cmd is None:
            cmd = popenargs[0]
        error = subprocess.CalledProcessError(retcode, cmd)
        error.output = output
        raise error
    return output

def compile(config):
    f = os.path.abspath(os.path.join(config['project_dir'], 'app'))
    if os.path.exists(f):
        print "[INFO] alloy app found at %s" % f
        rd = os.path.abspath(os.path.join(config['project_dir'], 'Resources'))

        # FIXME - need to support all platforms - https://jira.appcelerator.org/browse/ALOY-85
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
            print check_output(cmd, stderr=subprocess.STDOUT)
        except subprocess.CalledProcessError as ex:
            if hasattr(ex, 'output'):
                print ex.output
            print "[ERROR] Alloy compile failed"
            retcode = 1
            if hasattr(ex, 'returncode'):
                retcode = ex.returncode
            sys.exit(retcode)
        except:
            print "Unexpected error with Alloy compiler plugin:", sys.exc_info()[0]
            sys.exit(2)

