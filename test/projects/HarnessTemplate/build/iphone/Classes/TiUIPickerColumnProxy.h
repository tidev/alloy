/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#ifdef USE_TI_UIPICKER
#import "TiProxy.h"

@interface TiUIPickerColumnProxy : TiProxy {
@private
	NSMutableArray *rows;
	NSInteger column;
}

@property(nonatomic,readonly) NSMutableArray *rows;
@property(nonatomic,readonly) NSInteger rowCount;
@property(nonatomic,readwrite,assign) NSInteger column;

-(NSNumber*)addRow:(id)row;
-(void)removeRow:(id)row;
-(id)rowAt:(NSInteger)row;

@end
#endif
