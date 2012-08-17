/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */

#import "TiProxy.h"

@interface TiUIClipboardProxy : TiProxy {
@private
}

#pragma mark internal
-(id)getData_:(NSString *)mimeType;

-(void)clearData:(id)args;
-(void)clearText:(id)args;
-(id)getData:(id)args;
-(NSString *)getText:(id)args;
-(id)hasData:(id)args;
-(id)hasText:(id)args;
-(void)setData:(id)args;
-(void)setText:(id)args;

@end
