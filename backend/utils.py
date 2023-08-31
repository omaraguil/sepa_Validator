import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
import secrets
from flask_mail import Message


def generate_verification_code():
    return secrets.token_hex(3)


def send_verification_email(email, verification_code):
    from app import mail
    msg = Message("Verification Code",
                  sender="omaraguil4@gmail.com", recipients=[email])
    msg.body = f"Your verification code is: {verification_code}"
    mail.send(msg)


def compare_version(xml_file):
    xml_file.seek(0)
    xml_tree = ET.parse(xml_file)
    root = xml_tree.getroot()
    xmlVersion = root.tag
    # xsd = ET.parse(
    #     'C:\\Users\\omar\\OneDrive\\Bureau\\stage\\SepaValidator\\backend\\pain.008.001.02.xsd')

    # xsd_root = xsd.getroot()
    # xsdVersion = xsd_root.attrib.get('targetNamespace')
    xsdVersion = "urn:iso:std:iso:20022:tech:xsd:pain.008.001.02"
    if xsdVersion in xmlVersion:
        return True
    else:
        return False


def montantPlusQue(montant, xml_file):
    xml_file.seek(0)
    result_list = []
    tree = ET.parse(xml_file)
    root = tree.getroot()
    ns = {'ns': 'urn:iso:std:iso:20022:tech:xsd:pain.008.001.02'}
    dsc = root.findall(
        './/ns:DrctDbtTxInf', namespaces=ns)
    for kedha in dsc:
        instd = kedha.find('.//ns:InstdAmt', namespaces=ns).text
        InstdAmt = float(instd)
        if InstdAmt > float(montant):
            iban_element = kedha.find('.//ns:Id/ns:IBAN', namespaces=ns)
            iban = iban_element.text
            result_list.append({"amount": InstdAmt, "IBAN": iban})
    return result_list


def montantPlusQue_tag(montant, xml_file):
    xml_file.seek(0)
    result_list = []
    tree = ET.parse(xml_file)
    root = tree.getroot()
    ns = {'ns': 'urn:iso:std:iso:20022:tech:xsd:pain.008.001.02'}
    dsc = root.findall(
        './/ns:DrctDbtTxInf', namespaces=ns)
    for kedha in dsc:
        instd = kedha.find('.//ns:InstdAmt', namespaces=ns)
        amount = ET.tostring(instd, encoding='unicode')
        InstdAmt = float(instd.text)
        if InstdAmt > float(montant):
            iban_element = kedha.find('.//ns:Id/ns:IBAN', namespaces=ns)
            iban = ET.tostring(iban_element, encoding='unicode')
            result_list.append({"amount+iban": amount+iban})
    return result_list


def repeated_paiment(xml_file):
    xml_file.seek(0)
    result_list = {}
    tree = ET.parse(xml_file)
    root = tree.getroot()
    ns = {'ns': 'urn:iso:std:iso:20022:tech:xsd:pain.008.001.02'}
    dsc = root.findall(
        './/ns:Id/ns:IBAN', namespaces=ns)
    for item in dsc:
        iban1 = item.text
        if iban1 in result_list:
            result_list[iban1] += 1
        else:
            result_list[iban1] = 1
    final_result = {}
    for item in result_list:
        if result_list[item] > 1:
            final_result[item] = result_list[item]
    return final_result


def rep_p_tag(xml_file):
    xml_file.seek(0)
    result_list = {}
    tree = ET.parse(xml_file)
    root = tree.getroot()
    ns = {'ns': 'urn:iso:std:iso:20022:tech:xsd:pain.008.001.02'}
    dsc = root.findall(
        './/ns:Id/ns:IBAN', namespaces=ns)
    for item in dsc:
        item1 = ET.tostring(item, encoding='unicode')
        if item1 in result_list:
            result_list[item1] += 1
        else:
            result_list[item1] = 1
    repeated_paiments = ''
    for item in result_list:
        if result_list[item] > 1:
            for i in range(1, result_list[item]):
                repeated_paiments = repeated_paiments+item
    return repeated_paiments


def date_validate(xml_file):
    xml_file.seek(0)
    ibans = []
    current_date = datetime.now()
    tree = ET.parse(xml_file)
    root = tree.getroot()
    ns = {'ns': 'urn:iso:std:iso:20022:tech:xsd:pain.008.001.02'}
    for item in root.findall(
            './/ns:DrctDbtTxInf', namespaces=ns):
        date_xml_str = item.find(
            ".//ns:DrctDbtTx/ns:MndtRltdInf/ns:DtOfSgntr", namespaces=ns).text
        date_xml = datetime.strptime(date_xml_str, "%Y-%m-%d")
        max_allowed_date = current_date - timedelta(days=31)
        if date_xml < max_allowed_date:
            ibans.append({'IBAN': item.find('.//ns:Id/ns:IBAN',
                         namespaces=ns).text, 'date': date_xml_str})
    return ibans
