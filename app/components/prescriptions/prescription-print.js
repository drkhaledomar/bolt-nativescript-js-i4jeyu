import { Observable, ImageSource, knownFolders, path } from '@nativescript/core';
import { Printer } from '@nativescript/printer';
import { getString, setString } from '@nativescript/core/application-settings';

export function onNavigatingTo(args) {
    const page = args.object;
    const context = page.navigationContext;
    page.bindingContext = createViewModel(context);
}

function createViewModel(context) {
    const viewModel = new Observable();
    const { prescription, patient } = context;

    // Load saved settings
    const savedSettings = getString('prescriptionPrintSettings');
    const settings = savedSettings ? JSON.parse(savedSettings) : {
        headerText: 'Dr. John Doe\nPediatric Clinic\nAddress: 123 Medical St.\nPhone: (555) 123-4567',
        footerText: 'Thank you for your visit\nNext appointment:_____________',
        logoPath: '',
        copies: 1,
        savePrintSettings: true
    };

    // Initialize viewModel properties
    viewModel.set('headerText', settings.headerText);
    viewModel.set('footerText', settings.footerText);
    viewModel.set('logoSource', settings.logoPath ? ImageSource.fromFile(settings.logoPath) : null);
    viewModel.set('copies', settings.copies);
    viewModel.set('savePrintSettings', settings.savePrintSettings);
    viewModel.set('currentDate', new Date().toLocaleDateString());
    viewModel.set('patient', patient);

    // Format medications data
    viewModel.set('medications', prescription.medications.map(med => ({
        tradeName: med.tradeName || med.drug,
        scientificName: med.scientificName || '',
        dose: med.dose,
        unit: med.unit || '',
        frequency: med.frequency,
        route: med.route,
        duration: med.duration,
        price: med.price ? `$${med.price}` : '',
        remarks: med.remarks || ''
    })));

    // Load logo
    viewModel.onLoadLogo = async () => {
        try {
            const imagePickerOptions = {
                mediaType: 1,
                maxWidth: 500,
                maxHeight: 500
            };
            const selection = await imagepicker.create(imagePickerOptions).present();
            if (selection && selection.length > 0) {
                const selectedImage = selection[0];
                const documents = knownFolders.documents();
                const logoPath = path.join(documents.path, 'prescription-logo.png');
                await selectedImage.copyTo(logoPath);
                viewModel.set('logoSource', ImageSource.fromFile(logoPath));
                settings.logoPath = logoPath;
            }
        } catch (error) {
            console.error('Error loading logo:', error);
            alert('Failed to load logo');
        }
    };

    // Clear logo
    viewModel.onClearLogo = () => {
        viewModel.set('logoSource', null);
        settings.logoPath = '';
    };

    // Preview
    viewModel.onPreview = () => {
        // Generate HTML for preview
        const html = generatePrintHTML(viewModel);
        // Show preview in modal WebView
        showModal({
            moduleNameOrComponent: './components/prescriptions/prescription-preview',
            context: { html },
            fullscreen: true
        });
    };

    // Print
    viewModel.onPrint = async () => {
        try {
            // Save settings if enabled
            if (viewModel.get('savePrintSettings')) {
                settings.headerText = viewModel.get('headerText');
                settings.footerText = viewModel.get('footerText');
                settings.copies = viewModel.get('copies');
                settings.savePrintSettings = true;
                setString('prescriptionPrintSettings', JSON.stringify(settings));
            }

            // Generate HTML for printing
            const html = generatePrintHTML(viewModel);

            // Print options
            const options = {
                name: `Prescription_${patient.fileNumber}_${new Date().toISOString().split('T')[0]}`,
                copies: viewModel.get('copies'),
                orientation: 'portrait',
                paperSize: 'A4'
            };

            // Print
            await Printer.print(html, options);
        } catch (error) {
            console.error('Print error:', error);
            alert('Failed to print prescription');
        }
    };

    // Navigation
    viewModel.onBack = (args) => {
        args.object.page.frame.goBack();
    };

    return viewModel;
}

function generatePrintHTML(viewModel) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20mm;
                    margin: 0;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20mm;
                }
                .logo {
                    max-height: 60px;
                    margin-bottom: 10px;
                }
                .patient-info {
                    margin-bottom: 10mm;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20mm;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f8f9fa;
                }
                .footer {
                    text-align: center;
                    position: fixed;
                    bottom: 20mm;
                    left: 20mm;
                    right: 20mm;
                }
                @media print {
                    .no-print {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                ${viewModel.get('logoSource') ? 
                    `<img src="${viewModel.get('logoSource')}" class="logo" />` : ''}
                <div>${viewModel.get('headerText').replace(/\n/g, '<br>')}</div>
            </div>

            <div class="patient-info">
                <strong>Patient Name:</strong> ${viewModel.get('patient').name}<br>
                <strong>Age:</strong> ${viewModel.get('patient').age}<br>
                <strong>Date:</strong> ${viewModel.get('currentDate')}<br>
                <strong>File No:</strong> ${viewModel.get('patient').fileNumber}
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Medicine</th>
                        <th>Scientific Name</th>
                        <th>Dose</th>
                        <th>Frequency</th>
                        <th>Route</th>
                        <th>Duration</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${viewModel.get('medications').map(med => `
                        <tr>
                            <td>${med.tradeName}</td>
                            <td>${med.scientificName}</td>
                            <td>${med.dose} ${med.unit}</td>
                            <td>${med.frequency}</td>
                            <td>${med.route}</td>
                            <td>${med.duration}</td>
                            <td>${med.price}</td>
                        </tr>
                        ${med.remarks ? `
                        <tr>
                            <td colspan="7" style="font-style: italic;">
                                Remarks: ${med.remarks}
                            </td>
                        </tr>
                        ` : ''}
                    `).join('')}
                </tbody>
            </table>

            <div class="footer">
                ${viewModel.get('footerText').replace(/\n/g, '<br>')}
            </div>
        </body>
        </html>
    `;
}