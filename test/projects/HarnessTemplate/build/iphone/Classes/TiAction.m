/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */

#import "TiAction.h"


@implementation TiAction
@synthesize target,selector,arg;

-(id)initWithTarget:(id)target_ selector:(SEL)selector_ arg:(id)arg_
{
	if (self = [super init])
	{
		target = [target_ retain];
		selector = selector_;
		arg = [arg_ retain];
	}
	return self;
}

-(void)dealloc
{
	RELEASE_TO_NIL(arg);
	RELEASE_TO_NIL(target);
	[super dealloc];
}

-(void)execute
{
	[target performSelector:selector withObject:arg];
}

@end
