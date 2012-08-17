/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#import "TiBase.h"

@interface TiStylesheet : NSObject {
	NSDictionary* tagsDict;
	NSDictionary* tagsDictByDensity;
	NSDictionary* classesDict;
	NSDictionary* classesDictByDensity;
	NSDictionary* idsDict;
	NSDictionary* idsDictByDensity;
}

-(BOOL)basename:(NSString*)basename density:(NSString*)density hasTag:(NSString*)tagName;
-(id)stylesheet:(NSString*)objectId density:(NSString*)density basename:(NSString*)basename classes:(NSArray*)classes tags:(NSArray*) tags;

@end
