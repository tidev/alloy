
import os, sys, subprocess, hashlib

def compile(config):
    f = os.path.abspath(os.path.join(config['project_dir'], 'app'))
    if os.path.exists(f):
        print "[INFO] alloy app found at %s" % f
        rd = os.path.abspath(os.path.join(config['project_dir'], 'Resources'))
        # FIXME path resolution
		# FIXME - right now this works on OSX only
        cmd = "/usr/local/bin/node /usr/local/bin/alloy compile \"%s\" --no-colors" % (f)
        os.system(cmd)
