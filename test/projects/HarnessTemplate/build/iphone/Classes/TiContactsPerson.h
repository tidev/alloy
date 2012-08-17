/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#import "TiProxy.h"

#ifdef USE_TI_CONTACTS

#import <AddressBook/AddressBook.h>

@class ContactsModule;

@interface TiContactsPerson : TiProxy {
@private
	ABRecordRef record;
	ABRecordID recordId;
	
	ContactsModule* module;
}

@property(readonly,nonatomic) NSNumber* recordId;
@property(readonly,nonatomic) ABRecordRef record;

+(NSDictionary*)contactProperties;
+(NSDictionary*)multiValueProperties;
+(NSDictionary*)multiValueLabels;

-(id)_initWithPageContext:(id<TiEvaluator>)context recordId:(ABRecordID)id_ module:(ContactsModule*)module_;

-(NSString*)fullName;

@end

#endif