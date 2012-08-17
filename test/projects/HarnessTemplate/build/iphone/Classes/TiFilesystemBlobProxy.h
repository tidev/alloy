/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2010 by HarnessTemplate, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */

#import "TiBase.h"

#ifdef USE_TI_FILESYSTEM

#import "TiFile.h"

@interface TiFilesystemBlobProxy : TiFile {
@private
	NSURL *url;
	NSData *data;
}

-(id)initWithURL:(NSURL*)url data:(NSData*)data;

@end

#endif