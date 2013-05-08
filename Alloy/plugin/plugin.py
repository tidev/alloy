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
    paths = {}
    binaries = ["alloy","node"]

    dotAlloy = os.path.abspath(os.path.join(config['project_dir'], 'build', '.alloynewcli'))
    if os.path.exists(dotAlloy):
        print "[DEBUG] build/.alloynewcli file found, skipping plugin..."
        os.remove(dotAlloy)
    else:
        for binary in binaries:
            try:
                # see if the environment variable is defined
                paths[binary] = os.environ["ALLOY_" + ("NODE_" if binary == "node" else "") + "PATH"]
            except KeyError as ex:
                # next try PATH, and then our guess paths
                if sys.platform == "darwin" or sys.platform.startswith('linux'):
                    userPath = os.environ["HOME"]
                    guessPaths = [
                        "/usr/local/bin/"+binary,
                        "/opt/local/bin/"+binary,
                        userPath+"/local/bin/"+binary,
                        "/opt/bin/"+binary,
                        "/usr/bin/"+binary,
                        "/usr/local/share/npm/bin/"+binary
                    ]
                    
                    try:
                        binaryPath = check_output(["which",binary], stderr=subprocess.STDOUT).strip()
                        print "[DEBUG] %s installed at '%s'" % (binary,binaryPath)
                    except:
                        print "[WARN] Couldn't find %s on your PATH:" % binary
                        print "[WARN]   %s" % os.environ["PATH"]
                        print "[WARN]"
                        print "[WARN] Checking for %s in a few default locations:" % binary
                        for p in guessPaths:
                            sys.stdout.write("[WARN]   %s -> " % p)
                            if os.path.exists(p):
                                binaryPath = p
                                print "FOUND"
                                break
                            else:
                                print "not found"
                                binaryPath = None
                            
                    if binaryPath is None:
                        print "[ERROR] Couldn't find %s" % binary
                        sys.exit(1)
                    else:
                        paths[binary] = binaryPath
            
                # no guesses on windows, just use the PATH
                elif sys.platform == "win32":
                    paths["alloy"] = "alloy.cmd"
                
        f = os.path.abspath(os.path.join(config['project_dir'], 'app'))
        if os.path.exists(f):
            print "[INFO] alloy app found at %s" % f
            rd = os.path.abspath(os.path.join(config['project_dir'], 'Resources'))

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
            
            if sys.platform == "win32":
                cmd = [paths["alloy"], "compile", f, "--no-colors", "--config", cfg]
            else:
                cmd = [paths["node"], paths["alloy"], "compile", f, "--no-colors", "--config", cfg]

            print "[INFO] Executing Alloy compile:"
            print "[INFO]   %s" % " ".join(cmd)
            
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
            except EnvironmentError as ex:
                print "[ERROR] Unexpected error with Alloy compiler plugin: %s" % ex.strerror
                sys.exit(2)
